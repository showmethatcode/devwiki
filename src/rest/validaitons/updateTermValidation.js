import * as yup from 'yup'

export const updateTermSchema = yup.object().shape({
  description: yup.string().optional(),
  termRelatedNames: yup.array().of(yup.string().optional()).optional(),
})
