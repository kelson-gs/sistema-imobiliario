import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface IStatus {
  error: boolean;
  message: string | '';
  reason: string | '';
}

const resolvePath = (object: any, path: any, defaultValue?: any) => path.split('.').reduce((o: any, p: any) => (o ? o[p] : defaultValue), object);

function defaultHeader(token?: string) {
  if (token) {
    return {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}

function defaultErrorCallback(err: Error | AxiosError) {
  if (axios.isAxiosError(err)) {
    throw err;
  } else {
    throw err; // aqui ajudaria a tratar casos que é só um erro generico no código que acabou trigando dentro do axios por ser filho
  }
}

function defaultReturnCallback<T>(response: AxiosResponse<T>, returnProp?: string): T {
  if (returnProp) {
    const responseAsAny = response.data as any;

    if (returnProp.split('.').length > 1) {
      return resolvePath(responseAsAny, returnProp) as T;
    }

    return responseAsAny[returnProp] as T;
  }

  return response.data;
}

export class Crud {
  url: string;

  constructor(url: string) {
    this.url = url;
    this.defaultGet = this.defaultGet.bind(this);
    this.defaultPost = this.defaultPost.bind(this);
    this.defaultPatch = this.defaultPatch.bind(this);
    this.defaultDelete = this.defaultDelete.bind(this);
    this.defaultAuthenticatedGet = this.defaultAuthenticatedGet.bind(this);
    this.defaultAuthenticatedPost = this.defaultAuthenticatedPost.bind(this);
    this.defaultAuthenticatedPatch = this.defaultAuthenticatedPatch.bind(this);
    this.defaultAuthenticatedDelete = this.defaultAuthenticatedDelete.bind(this);
  }

  defaultGet<T>(endpoint: string, returnProp?: string, config?: AxiosRequestConfig): Promise<T> {
    return axios
      .create({
        ...config,
        headers: defaultHeader(),
      })
      .get<T>(`${this.url}/${endpoint}`)
      .then((response) => defaultReturnCallback<T>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        // todo mapear tipo pra erro
        throw defaultErrorCallback(err);
      });
  }

  defaultPost<T, J = any>(endpoint: string, data: T, returnProp?: string, config?: AxiosRequestConfig): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(),
      })
      .post<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultPatch<T, J = any>(endpoint: string, data: T, returnProp?: string): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(),
      })
      .patch<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultDelete<T, J = any>(endpoint: string, data?: T, returnProp?: string): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(),
      })
      .delete<J>(`${this.url}/${endpoint}`, data ? { data } : undefined)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultAuthenticatedGet<T>(
    endpoint: string,
    token: string,
    returnProp?: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return axios
      .create({
        ...config,
        headers: defaultHeader(token),
      })
      .get<T>(`${this.url}/${endpoint}`)
      .then((response) => defaultReturnCallback<T>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        // todo mapear tipo pra erro
        throw defaultErrorCallback(err);
      });
  }

  defaultAuthenticatedPost<T, J = IStatus>(endpoint: string, data: T, token: string, returnProp?: string, config?: AxiosRequestConfig): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(token),
      })
      .post<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultAuthenticatedPatch<T, J = any>(endpoint: string, data: T, token: string, returnProp?: string): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(token),
      })
      .patch<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultAuthenticatedDelete<T, J = any>(endpoint: string, data: T, token: string, returnProp?: string): Promise<J> {
    return axios
      .create({
        headers: defaultHeader(token),
      })
      .delete<J>(`${this.url}/${endpoint}`, data ? { data } : undefined)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }
}