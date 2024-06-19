const accessTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmU3YTcyZTEwNDU5MWFiZThjZWRkOCIsImp0aSI6ImZkOTBjOGZhLTNhNWUtNDIxOC04MjUyLTExZDRmNmIzNmRhMiIsInR5cGUiOiJhY2Nlc3NUb2tlbiIsImlhdCI6MTY2NDc4NjAzMSwiZXhwIjo0ODIwNTQ2MDMxfQ.y252jFUX_jnjfNpWkHUyVxcAR63oCNc_CrulKvq2dWk';
const refreshTokenMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmU3YTcyZTEwNDU5MWFiZThjZWRkOCIsImp0aSI6IjVkNjk3OTgwLWVkNDktNDdkMS05NWFhLWRhM2E1MTZjOWYyZiIsInR5cGUiOiJyZWZyZXNoVG9rZW4iLCJpYXQiOjE2NjQ3ODYyNDAsImV4cCI6NDgyMDU0NjI0MH0.vPzhsvbgm4qJMUASytAM0Abni_dfZw4pIlgXNsDOpnk';
const accessTokenExpiredMock =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNmU3YTcyZTEwNDU5MWFiZThjZWRkOCIsImp0aSI6IjVkNjk3OTgwLWVkNDktNDdkMS05NWFhLWRhM2E1MTZjOWYyZiIsInR5cGUiOiJyZWZyZXNoVG9rZW4iLCJpYXQiOjE2NjQ3ODYyNDAsImV4cCI6NDgyMDU0NTI0MH0.nD-WGBeplaMDJHLwmkms_lp4_k17DdT37jwd9APlEyg';

const accessTokenPayloadMock = {
  id: '626e7a72e104591abe8cedd8',
  jti: 'fd90c8fa-3a5e-4218-8252-11d4f6b36da2',
  type: 'accessToken',
  iat: 1664786031,
  exp: 4820546031,
};

const refreshTokenPayloadMock = {
  id: '626e7a72e104591abe8cedd8',
  jti: '5d697980-ed49-47d1-95aa-da3a516c9f2f',
  type: 'refreshToken',
  iat: 1664786240,
  exp: 4820546240,
};

export const MockAuthenticationService = {
  accessTokenSecretMock: 'eOPbB9EMAoxFDwrZx0M8bJOWiOPCor40y7kfXhRJG7RKe4wmz2QEz98P1WTOzx53',
  accessTokenMock,
  accessTokenPayloadMock,
  refreshTokenSecretMock: 'rtpTa5wXRo72wsEHlQM1T5J5OD4PnQOJgwxAoNm85anXaxRUo5nsLUtFmNoSQOtw',
  refreshTokenMock,
  refreshTokenPayloadMock,
  accessTokenExpiredMock,
};
