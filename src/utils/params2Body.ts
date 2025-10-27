/*
 * @Author: wuyifan wuyifan@udschina.com
 * @Date: 2025-10-27 14:43:23
 * @LastEditors: wuyifan wuyifan@udschina.com
 * @LastEditTime: 2025-10-27 17:24:28
 * @FilePath: \catchBirld\src\utils\params2Body.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Body, Box, Shape, Sphere, Vec3 } from "cannon-es";
import { PhysicsMeshData } from "../scene/PhysicsMesh";

class Params2Body {
    static toBody(bodyParams: PhysicsMeshData): Body {
        const { type, params, position, quaternion, mass } = bodyParams;
        const shape = Params2Body.toShape(type, params);
        console.log('shape: ', shape);

        const body = new Body({ mass });
        body.addShape(shape);

        Params2Body.processBody(body, type, params);

        if (position) {
            body.position.set(position.x, position.y, position.z);
        }
        if (quaternion) {
            body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
        return body;
    }

    private static toShape(type: string, params: any): Shape {
        switch (type) {
            case 'sphere':
                return new Sphere(params.radius);
            case 'plane':
                const box = new Box(new Vec3(params.width, params.height, 0.1));
                return box;
            default:
                console.warn(`Unsupported shape type: ${type}`);
                return new Shape();
        }
    }

    private static processBody(body: Body, type: string, params: any) {
        switch (type) {
            case 'plane': {
                // body.shapeOffsets.push(new Vec3(0, 0, -0.05));
                break;
            }
            default:
                break;
        }
    }
}

export { Params2Body };