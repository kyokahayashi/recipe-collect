import {render} from '@testing-library/vue'
import {createVuetify} from 'vuetify'
import type {components} from 'vue'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { h } from 'vue'

export function renderWithVuetify(component: component, options:options = {}) {
  const vuetify = createVuetify({ 
    components, 
    directives, 
  })
  return render({
    render: () => h(component, options.props),
  }, {
    global: {
      plugins: [vuetify],
    },
    ...options,
  })
}
