import { BehaviorSubject } from 'rxjs';

const alertSubject = new BehaviorSubject(null);

export const alertService = {
  alert: alertSubject.asObservable(),
  success,
  error,
  clear
};

const success = (message, showAfterRedirect = false) => {
  alertSubject.next({
    type: 'alert-success',
    message,
    showAfterRedirect
  });
};

const error = (message, showAfterRedirect = false) => {
  alertSubject.next({
    type: 'alert-danger',
    message,
    showAfterRedirect
  });
};

const clear = () => {
  let alert = alertSubject.value;

  if (alert?.showAfterRedirect) {
    alert.showAfterRedirect = false;
  } else {
    alert = null;
  }
  alertSubject.next(alert);
};