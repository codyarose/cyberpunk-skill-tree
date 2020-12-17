import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

// get query params
export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			query: context.query,
		},
	}
}

interface Queries {
	level: number
	body: number
	reflexes: number
	technicalAbility: number
	intelligence: number
	cool: number
}

const defaultState = {
	level: 1,
	maxLevel: 50,
	points: 7,
	minAttributePoints: 3,
	maxAttributePoints: 20,
}

export default function Home() {
	const router = useRouter()
	// query object comes in with string values, so they must be parsed into numbers
	const parsedQueries: Queries = Object.keys(router.query).reduce((acc: any, key) => {
		acc[key] = Number(router.query[key])
		return acc
	}, {})

	const { level: queryLevel } = parsedQueries

	// if no queryLevel use default, if queryLevel greater than max level use max level, othewise use queryLevel
	const initialLevel = !queryLevel
		? defaultState.level
		: queryLevel > defaultState.maxLevel
		? defaultState.maxLevel
		: queryLevel

	const [level, setLevel] = useState(initialLevel)

	const attributesInitialState = {
		body: defaultState.minAttributePoints,
		reflexes: defaultState.minAttributePoints,
		technicalAbility: defaultState.minAttributePoints,
		intelligence: defaultState.minAttributePoints,
		cool: defaultState.minAttributePoints,
	}
	// pull only attribute properties from parsedQueries
	const { level: omitLevel, ...attributesQueryState } = parsedQueries

	const [attributes, setAttributes] = useState<Omit<Queries, 'level'>>(attributesQueryState || attributesInitialState)
	type Attribute = keyof typeof attributes

	// adds up current attribute point values, minus default values to get amount of points that have been assigned
	const totalAssignedAttributePoints =
		Object.keys(attributes).reduce((sum: any, key: Attribute) => sum + attributes[key], 0) -
		defaultState.minAttributePoints * 5

	// calculates initial available points based on the default points, plus points from levels, minus the
	// amount of points that have been assigned. default level is subtracted to prevent extra point because
	// characters start at level 1, not 0
	const initialPoints = defaultState.points + (level - defaultState.level) - totalAssignedAttributePoints
	const [points, setPoints] = useState(initialPoints)

	// push level and attribute values into url as they're updated
	useEffect(() => {
		router.push({
			query: { level, ...attributes },
		})
	}, [level, attributes])

	const reset = () => {
		setLevel(defaultState.level)
		setPoints(defaultState.points)
		setAttributes(attributesInitialState)
	}

	const addLevel = () => {
		setLevel((prev) => (prev === defaultState.maxLevel ? prev : prev + 1))
		setPoints((prev) => prev + 1)
	}
	const subtractLevel = () => {
		setLevel((prev) => (prev > 1 ? prev - 1 : prev))
		setPoints((prev) => (prev > 0 ? prev - 1 : prev))
	}

	const addPoint = (property: Attribute) => {
		setPoints((prev) => prev - 1)
		setAttributes((prev) => ({
			...prev,
			[property]: attributes[property] + 1,
		}))
	}
	const subtractPoint = (property: Attribute) => {
		setPoints((prev) => prev + 1)
		setAttributes((prev) => ({
			...prev,
			[property]: attributes[property] - 1,
		}))
	}

	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
				<h2 className={utilStyles.headingLg}>Attributes</h2>
				<div>
					<h3>
						Level:{' '}
						<button onClick={subtractLevel} disabled={level === 1 || points === 0}>
							-
						</button>
						{level}
						<button onClick={addLevel} disabled={level === defaultState.maxLevel}>
							+
						</button>
					</h3>
				</div>

				<h3>Points: {points}</h3>
				<br />
				{Object.keys(attributes).map((attribute: Attribute) => (
					<div key={attribute}>
						<h3>
							{attribute}:{' '}
							<span>
								<button
									onClick={() => subtractPoint(attribute)}
									disabled={attributes[attribute] === defaultState.minAttributePoints}
								>
									-
								</button>
								{attributes[attribute]}
								<button onClick={() => addPoint(attribute)} disabled={points === 0}>
									+
								</button>
							</span>
						</h3>
					</div>
				))}
				<button onClick={reset}>reset</button>
			</section>
		</Layout>
	)
}
