import { useEffect, useRef } from 'react';
import {
  Engine,
  Events,
  Render,
  Bodies,
  World,
  Constraint,
  Mouse,
  MouseConstraint,
  Body,
  Vector,
  use,
  Runner,
} from 'matter-js';
import { getColor, gray } from './colors';
import type Graph from 'graphology';
import type { SigmaNode, SigmaEdge } from '../../types/basics';
// @ts-expect-error-next-line
import * as MatterAttractors from 'matter-attractors';
import { setConstraintRenderer } from './renderers/constraintRenderer';
import { setBodiesRenderer } from './renderers/bodiesRenderer';
import { toGraph, toSigmaGraph } from '../graphology';
import { setWorldRenderer } from './renderers/worldRenderer';
import {
  bodyAttractionMagnitude,
  boundsMultiplier,
  edgeColor,
  edgeLength,
  edgeStiffness,
  nodeLabelColor,
} from './defaultConsts';

use(MatterAttractors);

export default function MatterGraph({ data }: { data: Record<string, string[]> }) {
  const graph: Graph = toGraph(toSigmaGraph(data));

  const scene = useRef<HTMLDivElement>(null);
  // const isPressed = useRef(false)
  const engine = useRef(Engine.create());

  useEffect(() => {
    const elementBox = scene.current?.getBoundingClientRect();
    const cw = elementBox?.width ?? document.body.clientWidth;
    const ch = elementBox?.height ?? document.body.clientHeight;

    if (!scene) {
      throw new Error('no ref for scene');
    }

    setWorldRenderer();
    setConstraintRenderer();
    setBodiesRenderer();
    const render = Render.create({
      element: scene.current || undefined,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent',
        // hasBounds: true,
      },
      // bounds: {
      //   min: {
      //     x: -boundsMultiplier * cw,
      //     y: -boundsMultiplier * ch,
      //   },
      //   max: {
      //     x: boundsMultiplier * cw,
      //     y: boundsMultiplier * ch,
      //   },
      // },
    });

    engine.current.gravity.y = 0;

    // const wallSize = 500;
    // World.add(engine.current.world, [
    //   // Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
    //   Bodies.rectangle(cw / 2, -0.5 * wallSize, cw, wallSize, { isStatic: true }),
    //   // Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
    //   Bodies.rectangle(-0.5 * wallSize, ch / 2, wallSize, ch, { isStatic: true }),
    //   // Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
    //   Bodies.rectangle(cw / 2, ch + 0.5 * wallSize, cw, wallSize, { isStatic: true }),
    //   // Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    //   Bodies.rectangle(cw + 0.5 * wallSize, ch / 2, wallSize, ch, { isStatic: true }),
    // ]);

    const nodesBodies = new Map<string, Matter.Body>();
    graph.forEachNode((id, node) => {
      const nodeBody = addNode(engine, node as SigmaNode, cw, ch);
      nodesBodies.set(id, nodeBody);
    });
    graph.forEachEdge((key, edge) => addEdge(engine, edge as SigmaEdge, nodesBodies));

    const mouse = Mouse.create(render.canvas);

    const mouseConstraint = MouseConstraint.create(engine.current, {
      mouse: mouse,
      constraint: {
        render: {
          visible: false,
        },
      },
    });
    World.add(engine.current.world, mouseConstraint);

    Events.on(mouseConstraint, 'enddrag', (event) => {
      (event.body as Body).isStatic = !(event.body as Body).isStatic;
      if ((event.body as Body).isStatic) {
        (event.body as Body).render.lineWidth = 5;
        (event.body as Body).render.strokeStyle = '#2F2F2F';
      } else {
        (event.body as Body).render.lineWidth = 0;
      }
      console.log(event.body);
    });

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine.current);

    // const sourceNode = nodesBodies.get('SOURCE_CODE');
    // if (sourceNode) {
    //   Render.lookAt(render, sourceNode, {
    //     x: cw / 2,
    //     y: ch / 2,
    //   });
    // }

    return () => {
      Render.stop(render);
      World.clear(engine.current.world, false);
      Engine.clear(engine.current);
      render.canvas.remove();
      // @ts-expect-error-next-line
      render.canvas = null;
      // @ts-expect-error-next-line
      render.context = null;
      render.textures = {};
    };
  }, []);

  // const handleDown = () => {
  //   isPressed.current = true
  // }
  //
  // const handleUp = () => {
  //   isPressed.current = false
  // }
  //
  // const handleAddCircle = (e: any) => {
  //   if (isPressed.current) {
  //     const ball = Bodies.circle(
  //       e.clientX,
  //       e.clientY,
  //       10 + Math.random() * 30,
  //       {
  //         mass: 10,
  //         restitution: 0.9,
  //         friction: 0.005,
  //         render: {
  //           fillStyle: '#0000ff'
  //         }
  //       })
  //     World.add(engine.current.world, [ball])
  //   }
  // }

  // onMouseDown={handleDown}
  // onMouseUp={handleUp}
  // onMouseMove={handleAddCircle}

  return (
    <div>
      <div
        ref={scene}
        style={{ width: '100%', height: '100%', minWidth: '90vw', minHeight: '80vh' }}
      />
    </div>
  );
}

function addNode(engine: any, node: SigmaNode, cw: number, ch: number) {
  // const isSourceCodeNode = node.id === 'SOURCE_CODE';
  // const nodeX = isSourceCodeNode ? 700 : node.x! / 25;
  // const nodeY = isSourceCodeNode ? 700 : node.y! / 25;
  const nodeX = node.x! + cw / 2;
  const nodeY = node.y! + ch / 2;

  const ball = Bodies.circle(nodeX, nodeY, 25, {
    label: node.label,
    density: 0.04,
    frictionAir: 0.005,
    // isStatic: isSourceCodeNode,
    render: {
      fillStyle: node.module ? gray : getColor(),
      // @ts-expect-error-next-line
      text: {
        content: node.label,
        color: nodeLabelColor,
        size: 14,
        // family: "Papyrus",
      },
    },
    plugin: {
      attractors: [
        // MatterAttractors.Attractors.gravity
        // use Newton's law of gravitation
        (bodyA: Matter.Body, bodyB: Matter.Body) => {
          const bToA = Vector.sub(bodyB.position, bodyA.position);
          const distanceSq = Vector.magnitudeSquared(bToA) || 0.0001;
          const normal = Vector.normalise(bToA);
          const magnitude =
            MatterAttractors.Attractors.gravityConstant *
            bodyAttractionMagnitude *
            ((bodyA.mass * bodyB.mass) / distanceSq);
          const force = Vector.mult(normal, magnitude);

          // to apply forces to both bodies
          Body.applyForce(bodyA, bodyA.position, Vector.neg(force));
          Body.applyForce(bodyB, bodyB.position, force);
        },
      ],
    },
  });

  World.add(engine.current.world, ball);
  return ball;
}

function addEdge(engine: any, edge: SigmaEdge, nodes: Map<string, Matter.Body>) {
  const bodyA = nodes.get(edge.from);
  const bodyB = nodes.get(edge.to);
  const constraint = Constraint.create({
    label: edge.label,
    stiffness: edgeStiffness,
    length: edgeLength,
    type: 'line',
    render: {
      strokeStyle: edgeColor,
    },
    bodyA,
    bodyB,
  });
  World.add(engine.current.world, constraint);
  return constraint;
}
