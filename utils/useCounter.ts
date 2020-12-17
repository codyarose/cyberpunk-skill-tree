import { useState } from 'react'

const useCounter = (initialCount: number, availablePoints: number): [number, () => void, () => void, () => void] => {
	const [count, setCount] = useState(initialCount || 0)

	const increment = () => setCount((c) => (availablePoints > 0 ? c + 1 : c))
	const decrement = () => setCount((c) => (c > 0 ? c - 1 : 0))
	const reset = () => setCount(initialCount || 0)

	return [count, increment, decrement, reset]
}

export { useCounter }
