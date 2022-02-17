"use strict";

const bcrypt = require("bcrypt");
const uuid = require("uuid");
const db = require("@models/db");
const Token = require("@models/token");
const { AdminDto } = require("@dto");

const tableName = db.tables.admins.name;

class Authentication {
  async _hashPassword(password) {
    return bcrypt.hash(password, 3).catch((rej) => {
      throw new Error(rej);
    });
  }

  // Генерация ссылки для активации аккаунта
  _generateActivationLink() {
    return uuid.v4();
  }

  async _selectAdminByEmail(email) {
    try {
      const query = `
            SELECT * FROM ${tableName}
            WHERE email="${email}"
        `;
        const [data] = await db.query(query);

      return data;
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  async _isPasswordsEquals(data, encrypted) {
    return bcrypt.compare(data, encrypted).catch((rej) => {
      throw new Error(rej);
    });
  }

  async _getAdminDTO(admin) {
    try {
      // Создание объекта для отправки
      const dto = new AdminDto(admin);

      // Генерация токенов из отправляемого объекта
      const tokens = Token.generateTokens({ ...dto });

      // Сохранение refresh-токена
      await Token.saveToken(dto.id, tokens.refreshToken);

      return { ...tokens, admin: dto };
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  async login(email, password) {
    try {
      // Поиск пользователя по почте
      const admin = await this._selectAdminByEmail(email);

      if (!admin) {
        return {
          status: 404,
          msg: "Пользователь с таким e-mail не найден",
        };
      }

      // Проверка на идентичность паролей
      const isPassEquals = await this._isPasswordsEquals(
        password,
        admin.password
      );

      // Если пароли не совпадают
      if (!isPassEquals) {
        return {
          status: 400,
          msg: "Неверный пароль",
        };
      }

      return await this._getAdminDTO(admin);
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  async activateByLink(activationLink) {
    try {
      const admin = await db.query(`
                SELECT * FROM "${tableName}"
                WHERE activation_link='"${activationLink}'"
            `);

      if (admin.length === 0) {
        return "Ссылка введена не корректно";
      }

      await db.query(`
                UPDATE ${tableName}
                SET is_activated=true
                WHERE activation_link='"${activationLink}'"
            `);
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  async logout(refreshToken) {
    const token = await Token.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error("Некорректный токен");
      }

      const adminData = Token.validateRefreshToken(refreshToken);
      const tokenFrom = await Token.findToken(refreshToken);
      const [admin] = await db.query(`
                SELECT * FROM ${tableName}
                WHERE id=${adminData.id}
                LIMIT 1
            `);

      if (adminData && tokenFrom) {
        const dto = await this._getAdminDTO(admin);

        return dto;
      } else {
        return "Пользователь не авторизован";
      }
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  validateToken(accessTokenArg) {
    return Token.validateAccessToken(
      accessTokenArg
    ); /* Output: object | false  */
  }
}

module.exports = new Authentication();
