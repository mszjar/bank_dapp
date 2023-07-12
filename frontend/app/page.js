"use client"
import styles from './page.module.css'
import Layout from '@/components/Layout/Layout'
import Link from 'next/link'
import Bank from '@/components/Bank/Bank'

export default function Home() {
  return (
    <Layout>
          <Bank />
          <Link href='/about'>About</Link>
    </Layout>
  )
}
