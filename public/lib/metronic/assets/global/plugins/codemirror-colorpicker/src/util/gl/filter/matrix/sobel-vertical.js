import {
    convolution
} from '../util'

export default function sobelVertical () {
    return convolution([
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ]);
}
