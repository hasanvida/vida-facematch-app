exports.handler = async () => {

  const auth = Buffer.from(
    process.env.VIDA_CLIENT_ID + ":" +
    process.env.VIDA_CLIENT_SECRET
  ).toString("base64");

  const response = await fetch(
    "https://qa-sso.vida.id/auth/realms/vida/protocol/openid-connect/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials&scope=roles"
    }
  );

  const text = await response.text();

  return {
    statusCode: 200,
    body: text
  };
};

