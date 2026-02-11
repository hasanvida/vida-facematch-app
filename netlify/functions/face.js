const { randomUUID } = require("crypto");

exports.handler = async (event) => {

  try {

    const { action, faceImage } = JSON.parse(event.body);

    // Get token
    const tokenRes = await fetch(
      `${process.env.URL}/.netlify/functions/getToken`
    );
    const tokenData = await tokenRes.json();

    const token = tokenData.access_token;

    // Build request
    const body = {
      transactionId: randomUUID(),
      action: action,
      payload: { faceImage }
    };

    if(action === "search"){
      body.searchOptions = {
        threshold: 0.81,
        maxResult: 1
      };
    }

    // Call VIDA
    const vidaRes = await fetch(
      "https://my-services-sandbox.np.vida.id/api/v1/face/blacklist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      }
    );

    const text = await vidaRes.text();

    return {
      statusCode: 200,
      body: text
    };

  } catch(err){
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};

