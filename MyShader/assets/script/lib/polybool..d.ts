

type Polygon = {
    regions: number[][][];
    inverted: boolean;
}

type Segment = {
    segments: Segment[],
    inverted: boolean;
}

type GeoJSON = {
    type: string;
    geopolys: Polygon[];
}

interface IPolyBool {
    /**
     * Getter/setter for buildLog
     */
    buildLog: (bl: boolean) => object[] | boolean,
    /**
     * Getter/setter for epsilon
     */
    epsilon: (value: number) => number,
    segments: (poly: Polygon) => Segment,
    combine: (segment1: Segment, segment2: Segment) => {
        combined: object;
        inverted1: boolean;
        inverted2: boolean;
    },
    selectUnion: (combined: object) => Segment,
    selectIntersect: (combined: object) => Segment,
    selectDifference: (combined: object) => Segment,
    selectDifferenceRev: (combined: object) => Segment,
    selectXor: (combined: object) => Segment,
    polygon: (segments: Segment) => Polygon,
    polygonFromGeoJSON: (geojson: GeoJSON) => Polygon,
    polygonToGeoJSON: (poly: Polygon) => GeoJSON,
    union: (poly1: Polygon, poly2: Polygon) => Polygon,
    intersect: (poly1: Polygon, poly2: Polygon) => Polygon,
    difference: (poly1: Polygon, poly2: Polygon) => Polygon,
    differenceRev: (poly1: Polygon, poly2: Polygon) => Polygon,
    xor: (poly1: Polygon, poly2: Polygon) => Polygon
}

declare let PolyBool: IPolyBool;

