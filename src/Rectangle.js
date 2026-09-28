/** 스프라이트 경계 상자. 충돌 판정처럼 GPU 없이도 돌아야 하는 부분. */
class Rectangle {
    constructor (left = 0, right = 0, bottom = 0, top = 0) {
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
    }

    get width () {
        return this.right - this.left;
    }

    get height () {
        return this.top - this.bottom;
    }

    intersects (other) {
        return this.left <= other.right &&
            this.right >= other.left &&
            this.bottom <= other.top &&
            this.top >= other.bottom;
    }
}

export default Rectangle;
