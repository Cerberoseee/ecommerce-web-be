import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
import { Result } from 'src/common/results/result';

export function getJwtPayload({ id, email, role }) {
  return {
    id,
    email,
    role,
  };
}

export function generateJwtToken(tokenPayload, expiresIn = '60 days') {
  return jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn,
  });
}

export function generateJwtTokenForWorkspace(workspaceId: string) {
  try {
    return jsonwebtoken.sign(
      {
        workspace_id: workspaceId,
      },
      process.env.JWT_SECRET,
      {
        // expiresIn: '90 days',
      },
    );
  } catch (error) {
    throw error;
  }
}

export function generateJwtTokenForGuest(customer_id: string) {
  try {
    return jsonwebtoken.sign(
      {
        customer_id: customer_id,
      },
      process.env.JWT_SECRET,
      {
        // expiresIn: '90 days',
      },
    );
  } catch (error) {
    throw error;
  }
}

export function generateJwtTokenForFormBuilder(email: string) {
  try {
    return jsonwebtoken.sign(
      {
      email,
      },
      process.env.JWT_SECRET,
      {
      expiresIn: '30 days',
      },
    );
  } catch (error) {
    throw error;
  }
}

export function verifyJwtToken(token: string): [boolean, any] {
  return [
    decodeJwtToken(token).isSuccess,
    decodeJwtToken(token).isSuccess ? decodeJwtToken(token).value : null,
  ];
}

export function decodeJwtToken(token: string) {
  try {
    return Result.ok(jsonwebtoken.verify(token, process.env.JWT_SECRET));
  } catch (error) {
    console.log(error);
    return Result.fail({
      statusCode: 400,
      message: 'Invalid jwt token',
    });
  }
}

export function getTokenFromRequestHeader(request: express.Request): string {
  if (request.headers.authorization) {
    const [_, token] = request.headers.authorization.split(' ');

    const [isValid] = verifyJwtToken(token);
    if (isValid) {
      return token;
    }
  }
}

export function getSchemaFromRequestHeader(request: express.Request): string {
  if (request.headers.authorization) {
    const [_, token] = request.headers.authorization.split(' ');

    const [isValid, user] = verifyJwtToken(token);

    if (isValid) {
      return user.schema;
    }
  }
}

function parseSchemaFromOriginal(originalHost?: string): string {
  const data = originalHost?.split('.');
  return data[0];
}

export function getSchemaFromUrl(request: express.Request): string {
  if (process.env.HARD_CODE_SCHEMA) {
    return process.env.HARD_CODE_SCHEMA;
  }

  try {
    const serviceToken = request.headers['service-token'];
    if (serviceToken) {
      const decodeTokenValue: any = decodeJwtToken(
        serviceToken as string,
      ).value;
      const schema = decodeTokenValue?.schema;
      return schema;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  try {
    const originHost = (request.headers.origin || request.headers.referer)
      ?.replace('http://', '')
      ?.replace('https://', '')
      ?.replace('www.', '')
      ?.split(':')[0];
    const schema = parseSchemaFromOriginal(originHost);
    return schema;
  } catch (error) {
    console.log(error);
  }
}

export function generateStringeeToken() {
  return '';
}
