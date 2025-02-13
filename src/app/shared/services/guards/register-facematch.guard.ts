import { FaceMatchService } from './../face-match.service';
import { RegisterFaceMatchComponent } from './../../layout/modals/register-face-match/register-face-match.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from '../clientes/cliente.service';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterFacematchGuard implements CanActivate {
  modalRef;

  constructor(private modalService: NgbModal,
    private router: Router,
    private faceMatchService: FaceMatchService,
    private cliente: ClienteService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return this.cliente.getFaceMatchClient(user.id).pipe(
      take(1),
      switchMap((facematch) => {
        if (!facematch.facematch.register) {
          const modalRef = this.modalService.open(RegisterFaceMatchComponent);
          modalRef.componentInstance.user = facematch;
          return new Observable<boolean>((observer) => {
            modalRef.result.then(
              (result) => {
                if (result === 'confirm') {
                  observer.next(true);
                } else {
                  observer.next(false);
                  this.router.navigate(['/']);
                }
                observer.complete();
              },
              () => {
                observer.next(false);
                observer.complete();
              }
            );
          });
        } else {
          return new Observable<boolean>((observer) => {
            observer.next(true);
            observer.complete();
          });
        }
      })
    );
  }
}