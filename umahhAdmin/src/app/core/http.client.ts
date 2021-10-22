import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RouterState } from '@angular/router';
import { HttpEvent, HttpResponse, HttpClient, HttpHeaders, HttpParams, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

import { environment } from '../../environments/environment';
import { WebStorage } from './web.storage';

@Injectable()
export class httpClient implements HttpInterceptor {


  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: WebStorage,
    private activatedRoute: ActivatedRoute,
  ) {
    const state: RouterState = router.routerState;
    activatedRoute = state.root;
   }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append('Content-Type', 'application/json; charset=utf-8');
    // headers.append('Authorization', 'bearer ' + '');
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler) {
  //   const authRequest = req.clone({
  //     headers: req.headers.set("authorization", "Bearer " + this.storage.get('token'))
  //   });
  //   console.log("Auth Request ",authRequest);
  //   return next.handle(authRequest);
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authRequest = req.clone({
      headers: req.headers.set("authorization", "Bearer " + this.storage.get('token'))
    });

    return next.handle(authRequest)
      .do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body.code == 401) { // if user is not authorised direct him to login page
            let str =  this.router.url;
            let url = str.split("/");
            if (url[1] != 'login' && url[1] != 'signup') {
              this.router.navigate(['/login']);
            }
            return false;
          }
        }
      }, (err: any) => {
        return Observable.throw(err);
      })
  }

  delete(url) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    let options: any = {
      headers: headers
    };
    return this.http.delete(url, options)
  }

  get(url: any, data: any, fullUrl?: any) {
    fullUrl = false;
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    let options: any = {
      headers: headers
    };
    let params: HttpParams = new HttpParams();
    Object.keys(data).map(function (key, index) {
      if (data[key] != '') {
        params.set(key, data[key]);
      }
    });
    options['search'] = params;
    let reqUrl = (fullUrl) ? url : url;
    return this.http.get(reqUrl, options)
  }

  post(url: any, data: any, fullUrl?: any, contentType?: any) {
    fullUrl = fullUrl || false;
    let headers: any = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    let reqUrl = (fullUrl) ? url : url;
    let options: any = {
      headers: headers
    };
    return this.http.post(reqUrl, data, options);
  }

  extractData(res: any) {
    let body = res.json();
    return body.data || {};
  }

  handleError(error: any) {
    let errMsg: string = error.message ? error.message : error.toString();
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}