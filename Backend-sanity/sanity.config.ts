import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'My Sanity Project',

  projectId: 'mpo8w933',
  dataset: 'production',
  

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
