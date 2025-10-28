/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 14:43:23
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-28 17:29:42
 * @FilePath: \catchBirld\src\utils\params2Body.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body, Box, Cylinder, Quaternion, Shape, Sphere, Vec3 } from "cannon-es";
import { PhysicsMeshData } from "../scene/PhysicsMesh";

type ShapeResult = {
    shape: Shape;
    offset?: Vec3;
    quaternion?: Quaternion;
}

class Params2Body {
    static toBody(bodyParams: PhysicsMeshData): Body {
        const { type, params, position, quaternion, mass } = bodyParams;
        const shapes = Params2Body.toShape(type, params);

        const body = new Body({ mass });
        shapes.forEach(({ shape, offset, quaternion }: ShapeResult) => {
            body.addShape(shape, offset ?? new Vec3(), quaternion ?? new Quaternion());
        })


        if (position) {
            body.position.set(position.x, position.y, position.z);
        }
        if (quaternion) {
            body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
        return body;
    }

    private static toShape(type: string, params: any): Array<ShapeResult> {
        const result: Array<ShapeResult> = [];
        switch (type) {
            case 'sphere':
                return [{ shape: new Sphere(params.radius) }];
            case 'plane':
                return [{ shape: new Box(new Vec3(params.width, 0.1, params.height)) }];
            case 'cylinder':
                return [{ shape: new Cylinder(params.radiusTop, params.radiusBottom, params.height, params.segments) }];
            case 'box':
                return [{ shape: new Box(new Vec3(params.width, params.height, params.depth)) }];
            case 'torus': {
                const { radius, tube, tubeSegments, radialSegments } = params;
                const pice = Math.PI * 2 / tubeSegments;
                const halfPice = pice / 2;
                const D = radius * Math.sin(halfPice);
                const H = radius * Math.cos(halfPice)
                const d = (D * (H - tube)) / H;

                const columnShape = new Cylinder(tube, tube, d * 2, radialSegments);
                for (let j = 0, k = halfPice; j < tubeSegments; j++, k = j * pice + halfPice) {
                    const offset = new Vec3(H * Math.cos(k), H * Math.sin(k), 0);
                    const quaternion = new Quaternion().setFromEuler(0, 0, k, 'YXZ')
                    result.push({ shape: columnShape, offset, quaternion })
                }
                return result;
            }
            default:
                console.warn(`Unsupported shape type: ${type}`);
                return result;
        }
    }
}

export { Params2Body };