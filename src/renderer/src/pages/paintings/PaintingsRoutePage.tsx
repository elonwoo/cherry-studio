import { loggerService } from '@logger'
import { useAllProviders } from '@renderer/hooks/useProvider'
import { useAppDispatch } from '@renderer/store'
import { setDefaultPaintingProvider } from '@renderer/store/settings'
import { updateTab } from '@renderer/store/tabs'
import type { PaintingProvider } from '@renderer/types'
import { isNewApiProvider } from '@renderer/utils/provider'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'

import NewApiPage from './NewApiPage'
import ZhipuPage from './ZhipuPage'

const logger = loggerService.withContext('PaintingsRoutePage')

const BASE_OPTIONS: string[] = ['zhipu']

const PaintingsRoutePage: FC = () => {
  const params = useParams()
  const provider = params['*']
  const dispatch = useAppDispatch()
  const providers = useAllProviders()

  const Options = useMemo(() => [...BASE_OPTIONS, ...providers.filter(isNewApiProvider).map((p) => p.id)], [providers])
  const newApiProviders = useMemo(() => providers.filter(isNewApiProvider), [providers])

  useEffect(() => {
    logger.debug(`defaultPaintingProvider: ${provider}`)
    if (provider && Options.includes(provider)) {
      dispatch(setDefaultPaintingProvider(provider as PaintingProvider))
      dispatch(updateTab({ id: 'paintings', updates: { path: `/paintings/${provider}` } }))
    }
  }, [provider, dispatch, Options])

  return (
    <Routes>
      <Route path="*" element={<NewApiPage Options={Options} />} />
      <Route path="/zhipu" element={<ZhipuPage Options={Options} />} />
      <Route path="/new-api" element={<NewApiPage Options={Options} />} />
      {/* new-api family providers are mounted dynamically below */}
      {newApiProviders.map((p) => (
        <Route key={p.id} path={`/${p.id}`} element={<NewApiPage Options={Options} />} />
      ))}
    </Routes>
  )
}

export default PaintingsRoutePage
