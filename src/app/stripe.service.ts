import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class StripeService {
  private apiUrl = "https://localhost:9090/api/stripe";

  constructor(private http: HttpClient) { }
  createCheckoutSession() {
    return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/create-checkout-session`, {});
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