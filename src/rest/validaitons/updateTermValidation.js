import * as yup from 'yup'

export const updateTermSchema = yup.object().shape({
  description: yup.string().optional(),
  tagNames: yup.array().of(yup.string().optional()).optional(),
})
