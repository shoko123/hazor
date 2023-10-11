type TLoginForm = {
        email: string,
        password: string
      }
      type TRgistrationForm = {
        email: string,
        password: string
      }
      
      type TUser = {
        'name': string,
        'id': number,
        'token': string,
        'permissions': string[]
      }

export { TLoginForm, TRgistrationForm, TUser }