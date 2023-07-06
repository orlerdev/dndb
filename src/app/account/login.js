import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Layout } from './Layout.js';
import { userService, alertService } from 'services';

export const Login = () => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = ({ username, password }) => {
    alertService.clear();
    return userService.login(username, password)
      .then(() => {
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl);
      })
      .catch(alertService.error);
  };

  return (
    <Layout>
      <div className="card">
        <h4 className="card-header">Login</h4>
        <div className="card-body">
          <form onSubmit={ handleSubmit(onSubmit) }>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input name="username" type="text" { ...register('username') } className={ `form-control ${ errors.username ? 'is-invalid' : '' }` } />
              <div className="invalid-feedback">{ errors.username?.message }</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" { ...register('password') } className={ `form-control ${ errors.password ? 'is-invalid' : '' }` } />
              <div className="invalid-feedback">{ errors.password?.message }</div>
            </div>
            <button disabled={ formState.isSubmitting } className="btn btn-primary">
              { formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span> }
              Login
            </button>
            <Link href="/account/register" className="btn btn-link">Register</Link>
          </form>
        </div>
      </div>
    </Layout>
  );



};