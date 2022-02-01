import * as yup from 'yup'

export const createTermSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().optional(),
  termRelatedNames: yup.array().of(yup.string().optional()).optional(),
})
