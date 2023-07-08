import { Container, Paper } from '@mui/material'
import fs from 'fs'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import path from 'path'

import { Markdown } from '~/components/markdown'

type Params = {
  id: string
}

type Props = {
  id: string
  contents: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts')

  const fileNames = fs.readdirSync(postsDirectory)

  const paths = fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  if (!params?.id) throw new Error('')
  const postsDirectory = path.join(process.cwd(), 'posts')

  const fullPath = path.join(postsDirectory, `${params.id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  return {
    props: {
      id: params.id,
      contents: fileContents
    }
  }
}

const Note: NextPage<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{props.id}</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <main>
        <Container maxWidth='md' sx={{ p: 2 }}>
          <Paper variant='outlined' sx={{ px: 1, borderRadius: '6px' }}>
            <Markdown>{props.contents}</Markdown>
          </Paper>
        </Container>
      </main>
    </>
  )
}

export default Note
