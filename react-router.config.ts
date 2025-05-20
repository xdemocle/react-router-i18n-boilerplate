import type { Config } from '@react-router/dev/config'
import 'react-router'

declare module 'react-router' {
  interface Future {
    // unstable_middleware: true;
    unstable_viteEnvironmentApi: true
  }
}

export default {
  ssr: true,
  future: {
    // unstable_middleware: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config
