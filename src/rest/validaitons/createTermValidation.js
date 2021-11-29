import * as yup from 'yup'

export const createTermSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().optional(),
})
