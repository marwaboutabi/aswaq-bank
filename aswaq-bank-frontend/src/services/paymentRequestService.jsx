import api from "./api";

const paymentRequestService = {

  create(amount, description) {
    const params = new URLSearchParams();
    params.append("amount", amount);

    if (description) {
      params.append("description", description);
    }

    return api.post(
      "/payment-requests/create",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  },

  getMerchantRequests() {
    return api.get("/payment-requests/merchant");
  },

  getByReference(reference) {
    return api.get(`/payment-requests/${reference}`);
  },

  pay(reference) {
    return api.post(`/payment-requests/pay/${reference}`);
  }

};

export default paymentRequestService;