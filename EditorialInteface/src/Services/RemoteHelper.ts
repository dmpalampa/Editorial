import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class RemoteHelper {
  private httpOptions;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json'
      }),
      observe: "body"
    };
  }


  //private uatServerUrl = 'http://172.17.2.247:8081/monitor/editorial/';
  private uatServerUrl = 'http://localhost:8081/monitor/editorial/';
  private serverUrl = "../monitor/editorial/AllService/";

  sendPostToServer(uri: String, data: String): Observable<any> {
    if (!environment.production) {
      this.serverUrl = this.uatServerUrl
    }
    console.log("Will use url " + this.serverUrl + uri)
    this.logDevMode("Sending to server " + data)
    return this.http.post<any>(this.serverUrl + uri, data, this.httpOptions);

  }

  getRequest(outlet) {
    if (!environment.production) {
      this.serverUrl = this.uatServerUrl
    }
    return this.http.get(this.serverUrl + outlet);
  }


  logDevMode(event: string) {
    if (!environment.production) console.log(event)
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
}
