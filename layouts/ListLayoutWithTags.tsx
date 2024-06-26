/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import type { Blog } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="space-y-2 ">
        <div className="space-y-2 divide-y divide-gray-200 dark:divide-gray-700">
          <h1
            className={`text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14`}
          >
            {title}
          </h1>
          <p className="pt-3 text-lg leading-7 text-gray-500 dark:text-gray-300">
            {siteMetadata.description}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="hidden w-full max-w-3xl sm:flex">
            <div className="w-full space-y-2 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="font-bold uppercase text-primary-500">Tags</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="font-bold uppercase leading-9 text-gray-700 underline hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-500"
                >
                  Remove Filter(s)
                </Link>
              )}
              <ul className="flex w-full flex-wrap gap-2 overflow-auto rounded ">
                {sortedTags.map((t) => {
                  return (
                    <li
                      key={t}
                      className="shrink-0 rounded-full border border-gray-400 p-1  dark:border-gray-500 [&:has(h3,a:hover)]:border-primary-400 dark:[&:has(h3,a:hover)]:border-primary-400"
                    >
                      {pathname.split('/tags/')[1]?.includes(slug(t)) ? (
                        <Link
                          href={(() => {
                            const filters = pathname
                              .split('/tags/')[1]
                              .split('&')
                              .filter((x) => x !== slug(t))
                            if (filters.length === 0) {
                              return '/blog'
                            }
                            return `/tags/${filters.join('&')}`
                          })()}
                          className="text-primary-400"
                          onClick={() => {}}
                        >
                          <h3 className="inline-flex items-center gap-1 px-2 py-1 text-sm font-bold text-primary-500">
                            {`${t} `}

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-4 w-4 "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </h3>
                        </Link>
                      ) : (
                        <Link
                          href={(() => {
                            let filters = pathname.split('/tags/')[1]?.split('&')
                            if (!filters) {
                              return `/tags/${t}`
                            }
                            filters = [...filters, slug(t)]
                            return `/tags/${filters.join('&')}`
                          })()}
                          className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} `}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
