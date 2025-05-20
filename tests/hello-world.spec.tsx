// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import HelloWorld from '../app/components/hello-world/hello-world'

test('renders name', async () => {
  const { getByText, getByRole } = render(<HelloWorld name="Vitest" />)

  await expect.element(getByText('Hello Vitest x1!')).toBeInTheDocument()
  await getByRole('button', { name: 'Increment ' }).click()

  await expect.element(getByText('Hello Vitest x2!')).toBeInTheDocument()
})
