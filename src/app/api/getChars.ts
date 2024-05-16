'use server'
import { getCharacters, Character } from "rickmortyapi";


const getRickApi = async (searchString: string) => {
    try {
        const res = await getCharacters({
            name: searchString,
        });
        if (res.statusMessage == 'OK') {
            return res?.data?.results
        }
        else {
            return []
        }
    } catch (error) {
        console.log(error)
    }
}
export default getRickApi