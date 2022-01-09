import Head from 'next/head'
import { useMemo, useRef } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Grid, Tooltip } from '@chakra-ui/react'
import Image from 'next/image'
import moment from 'moment'
import { useContext } from 'react'

import AppContext from '../AppContext'
import Navbar from '../components/Navbar'
import ManageStars from '../components/ManageStars'
import StarPng from '../public/images/star.png'

const Home = () => {
	const initialRef = useRef()

	const { isOpen, onOpen, onClose } = useDisclosure()

	const {
		state: { starData, isOwner },
	} = useContext(AppContext)

	const stellarWeeks = useMemo(() => {
		if (starData) {
			const weekData = starData.reduce((weeks, star) => {
				const thisWeek = moment(star.created_at)
					.startOf('week')
					.format('YYYY-MM-DD')

				if (!Object.keys(weeks).includes(thisWeek)) {
					weeks = {
						...weeks,
						[thisWeek]: [],
					}
				}

				weeks[thisWeek].push(star)

				return weeks
			}, {})

			console.log({ weekData })

			return weekData
		}

		return {}
	}, [starData])

	return (
		<div>
			<Head>
				<title>subStar</title>
				<meta name="description" content="Give your sub a star." />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<Navbar onOpen={onOpen} />
				<Grid templateRows={'auto'} rowGap={'2rem'} p="2rem">
					{stellarWeeks &&
						Object.keys(stellarWeeks)
							.sort()
							.reverse()
							.map((weekNumber) => (
								<div key={`week-${weekNumber}`}>
									{console.log(weekNumber)}
									<strong>
										Week of{' '}
										{moment(weekNumber)
											// .week(weekNumber)
											// .add(1, 'week')
											// .day(2)
											.format('YYYY-MM-DD')}{' '}
										thru{' '}
										{moment(weekNumber)
											// .week(weekNumber)
											.add(6, 'days')
											// .day(8)
											.format('YYYY-MM-DD')}
									</strong>
									<Grid
										templateColumns={
											'repeat(auto-fill, 3rem)'
										}
										p="1rem"
										gap={'.5rem'}
									>
										{stellarWeeks[weekNumber]
											.reverse()
											.map((star) =>
												star.is_super ? (
													<Tooltip
														label={`${moment(
															star.created_at
														).format(
															'ddd - MM-DD'
														)} - ${
															star.description
														}`}
														key={star.id}
														isDisabled={!isOwner}
													>
														<div
															style={{
																filter: 'opacity(.5) hue-rotate(120deg) drop-shadow(0 0 0 #0000ff)',
															}}
														>
															<Image
																title={
																	star.description
																}
																src={StarPng}
																height={100}
																width={100}
															/>
														</div>
													</Tooltip>
												) : (
													<Tooltip
														label={`${moment(
															star.created_at
														).format(
															'ddd - MM-DD'
														)} - ${
															star.description
														}`}
														key={star.id}
														isDisabled={!isOwner}
													>
														<div>
															<Image
																title={
																	star.description
																}
																src={StarPng}
																height={100}
																width={100}
															/>
														</div>
													</Tooltip>
												)
											)}
									</Grid>
								</div>
							))}
				</Grid>
				<ManageStars
					isOpen={isOpen}
					onClose={onClose}
					initialRef={initialRef}
				/>
			</main>
		</div>
	)
}

export default Home
