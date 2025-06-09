import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class StripeService {
  private apiUrl = "https://localhost:9090/api/stripe";

  constructor(private http: HttpClient) { }
  checkoutSession(amount: any, url: string) {
    let info = {
      name: 'Premium Plan',
      amount: amount,
      quantity: 1,
      url: url
    }
    return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/create-checkout-session`, info);
  }
//   paymentIntent(amount: any) {
//     const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : "";
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//     let info = {
//       "amount": amount
//     }
//       return this.http.post<any>(`${this.apiUrl}/create-payment-intent`,info, { headers });
//   }

//   fncObtainTotalAmount() : any{
//     const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
//     const headers = {
//         'Authorization' : `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     }
//     return this.http.get<any>(`${this.apiUrl}/obtainTotalAmount`, { headers });

//   }

//   fncObtainOperations() : any{
//     const token = (localStorage.getItem('access_token')) ? localStorage.getItem('access_token') : "";
//     const headers = {
//         'Authorization' : `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     }
//     return this.http.get<any>(`${this.apiUrl}/obtainOperations`, { headers });

//   }
}
export interface CheckoutSessionResponse {
  sessionId: string;
}