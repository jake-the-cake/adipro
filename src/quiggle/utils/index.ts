export function changeDirectory(path: string, value: string | number): string {
	if (typeof value === 'number') {
		const arr = path.split('/')
		for (let i = 0; i < value; i++) {
			arr.pop()
		}
		path = arr.join('/')
	}
	if (typeof value === 'string') path = path + value
	return path
}

const QuiggleUtils = {
  changeDirectory
}

export default QuiggleUtils