import axios from "axios";
import myKey from "./KhaltiKey";
 
let config = {
  publicKey: myKey.publicTestKey,
  productIdentity: "959599",
  productName: "Slesha",
  productUrl: "https://localhost:5000",
  eventHandler: {
    onSuccess(payload) {
      console.log(payload);
      let data = {
        token: payload.token,
        amount: payload.amount,
      };
 
      let config = {
        headers: { Authorization: myKey.secretKey },
      };
 
      axios
        .post("https://a.khalti.com/api/v2/payment/verify/", data, config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onError(error) {
      console.log(error);
    },
    onClose() {
      console.log("widget is closing");
    },
  },
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};
 
export default config;