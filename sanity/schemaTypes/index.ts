import { type SchemaTypeDefinition } from 'sanity'
import {userType} from './userType'
import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, blockContentType, categoryType, postType, authorType],

}
