import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { filter, finalize, map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import DownloadedFile from '../_models/downloaded-file';
import { ToastrService } from 'ngx-toastr';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { UtilityService } from '../_services/utility.service';
import { saveAs } from 'file-saver';

@Injectable()
export class HttpService {
    public static DOWNLOAD_PROGRESS_TITLE: string =
        'Downloading Contents';
    public static DOWNLOAD_PROGRESS_MESSAGE: string =
        'Content download in progress, please wait';
    public static DOWNLOAD_COMPLETED_TITLE: string = 'Downloading Contents';
    public static DOWNLOAD_COMPLETED_MESSAGE: string = 'Completed';
    public static DOWNLOAD_ERROR_TITLE: string = 'Error';
    public static DOWNLOAD_ERROR_MESSAGE: string =
        'The content could not be downloaded, please try again';

    public static GENERIC_ERROR_TITLE = 'Error';

    private ngProgressRef: NgProgressRef;

    constructor(
        private http: HttpClient,
        private ngProgress: NgProgress,
        private toastr: ToastrService,
        private utilityService: UtilityService) {
        this.ngProgressRef = this.ngProgress.ref();
    }

    get(url: string): Observable<any> {
        let httpHeaders = this.getJsonHeaders();

        let httpObservable = this.http.get<any>(environment.api_url + url, {
            headers: httpHeaders
        });

        return this.handleResponse(httpObservable);
    }

    postJson(url: string, body: any): Observable<any> {
        let httpHeaders = this.getJsonHeaders();

        let httpObservable = this.http.post<any>(
            environment.api_url + url, body, {
                headers: httpHeaders
            });

        return this.handleResponse(httpObservable);
    }

    postForm(url: string, formData: FormData): Observable<any> {
        let httpHeaders = this.getFormHeaders();

        let httpObservable = this.http.post<any>(
            environment.api_url + url, formData, {
                headers: httpHeaders
            });

        return this.handleResponse(httpObservable);
    }

    downloadFile(
        url: string,
        body: any,
        progressTitle: string = HttpService.DOWNLOAD_PROGRESS_TITLE,
        progressMessage: string = HttpService.DOWNLOAD_PROGRESS_MESSAGE,
        completedTitle: string = HttpService.DOWNLOAD_COMPLETED_TITLE,
        completedMessage: string = HttpService.DOWNLOAD_COMPLETED_MESSAGE,
        errorTitle: string = HttpService.DOWNLOAD_ERROR_TITLE,
        errorMessage: string = HttpService.DOWNLOAD_ERROR_MESSAGE) {
        const toast = this.toastr.warning(progressMessage, progressTitle, {
            disableTimeOut: true,
            tapToDismiss: false
        });
        this.getFile(url, body)
            .pipe(finalize(() => this.toastr.remove(toast.toastId)))
            .subscribe(
                data => {
                    this.toastr.success(completedMessage, completedTitle);
                    saveAs(data.blob, data.filename);
                },
                () => {
                    this.toastr.error(errorMessage, errorTitle, {
                        closeButton: true,
                        disableTimeOut: true
                    });
                }
            );
    }

    uploadFile(url: string, formData: FormData) {
        let httpHeaders = this.getFormHeaders();

        this.ngProgressRef.start();
        return this.http.post(environment.api_url + url, formData, {
            observe: 'events',
            reportProgress: true,
            headers: httpHeaders
        }).pipe(
            map(data => {
                if (data.type === HttpEventType.UploadProgress) {
                    // progress
                    this.ngProgressRef.set(data.loaded / data.total);
                } else if (data.type === HttpEventType.Response) {
                    // response
                    return data.body;
                }
                return null;
            }),
            filter(data => data !== null),
            finalize(() => this.ngProgressRef.complete())
        );
    }    

    private getFile(url: string, body: any): Observable<DownloadedFile> {
        let httpHeaders = this.getJsonHeaders();

        this.ngProgressRef.start();

        return this.http.post<Blob>(environment.api_url + url, body, {
            headers: httpHeaders,
            responseType: 'blob' as 'json',
            reportProgress: true,
            observe: 'events'
        }).pipe(
            map(data => {
                if (data.type === HttpEventType.DownloadProgress) {
                    // progress
                    this.ngProgressRef.set(data.loaded / data.total);
                } else if (data.type === HttpEventType.Response) {
                    // response
                    const filename =
                        data.headers.get('Content-Disposition')
                            .match(/filename="(.*)"/)[1];
                    return {
                        blob: data.body,
                        content_type: data.headers.get('Content-Type'),
                        filename: filename
                    };
                }
                return null;
            }),
            filter(data => data !== null),
            finalize(() => this.ngProgressRef.complete())
        );
    }

    private handleResponse(httpObservable: Observable<any>): Observable<any> {
        return httpObservable.pipe(
            map(response => {
                let message = null;
                if (response.message !== null
                    && response.message !== undefined) {
                    message = response.message;
                }

                if (response.status == 'success') {
                    return response.data;
                } else if (response.status == 'error') {
                    throw new Error(message);
                }
            }),
            catchError((error: any) => {
                let message = null;
                if (error.message !== null
                    && error.message !== undefined) {
                    message = error.message;
                } else {
                    message = error;
                }

                this.toastr.error(message, HttpService.GENERIC_ERROR_TITLE, {
                    closeButton: true,
                    disableTimeOut: true
                });

                return throwError(message);
            })
        );
    }

    private getJsonHeaders() {
        let httpHeadersList = this.getDefaultHeadersList();

        Object.assign(httpHeadersList, {
            'Content-Type': 'application/json',
        });

        return new HttpHeaders(httpHeadersList);
    }

    private getFormHeaders() {
        let httpHeadersList = this.getDefaultHeadersList();

        return new HttpHeaders(httpHeadersList);
    }

    private getDefaultHeadersList() {
        let token = this.utilityService.getCurrentUserToken();

        let httpHeadersList = {
            'Access-Control-Allow-Origin': '*',
            'User-Timezone': this.utilityService.getCurrentTimezone()
        }

        if (token !== null) {
            Object.assign(httpHeadersList, {
                'Authorization': 'Bearer ' + token
            });
        }

        return httpHeadersList;
    }
}