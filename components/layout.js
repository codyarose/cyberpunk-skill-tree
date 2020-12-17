import Head from "next/head"
import styles from "./layout.module.css"
import Link from "next/link"

export const siteTitle = "Cyberpunk 2077 Skill Tree Builder"

export default function Layout({ children, home }) {
	return (
		<div className={styles.container}>
			<Head>
				<link rel='icon' href='/favicon.ico' />
				<meta
					name='description'
					content='Build your Cyberpunk 2077 character skill tree'
				/>
				<meta name='og:title' content={siteTitle} />
				<meta name='twitter:card' content='summary_large_image' />
			</Head>
			<header className={styles.header}>
				<h1>Cyberpunk 2077 Skill Tree Builder</h1>
			</header>
			<main>{children}</main>
			{!home && (
				<div className={styles.backToHome}>
					<Link href='/'>
						<a>← Back to home</a>
					</Link>
				</div>
			)}
		</div>
	)
}
