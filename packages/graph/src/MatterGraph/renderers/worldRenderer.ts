// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Render, Common, Vector, Composite, Events, Bounds } from 'matter-js';

export function setWorldRenderer(): void {
  /**
   * Applies the background to the canvas using CSS.
   * @method applyBackground
   * @private
   * @param {render} render
   * @param {string} background
   */
  const _applyBackground = function (render, background) {
    let cssBackground = background;

    if (/(jpg|gif|png)$/.test(background)) cssBackground = 'url(' + background + ')';

    render.canvas.style.background = cssBackground;
    render.canvas.style.backgroundSize = 'contain';
    render.currentBackground = background;
  };
  /**
   * Renders the given `engine`'s `Matter.World` object.
   * This is the entry point for all rendering and should be called every time the scene changes.
   * @method world
   * @param {render} render
   */
  Render.world = function (render, time) {
    const startTime = Common.now(),
      engine = render.engine,
      world = engine.world,
      canvas = render.canvas,
      context = render.context,
      options = render.options,
      timing = render.timing;

    let allBodies = Composite.allBodies(world),
      allConstraints = Composite.allConstraints(world),
      background = options.wireframes ? options.wireframeBackground : options.background,
      bodies = [],
      constraints = [],
      i;

    const event = {
      timestamp: engine.timing.timestamp,
    };

    Events.trigger(render, 'beforeRender', event);

    // apply background if it has changed
    if (render.currentBackground !== background) _applyBackground(render, background);

    // clear the canvas with a transparent fill, to allow the canvas background to show
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = 'transparent';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';

    // handle bounds
    if (options.hasBounds) {
      // filter out bodies that are not in view
      for (i = 0; i < allBodies.length; i++) {
        const body = allBodies[i];
        if (Bounds.overlaps(body.bounds, render.bounds)) bodies.push(body);
      }

      // filter out constraints that are not in view
      for (i = 0; i < allConstraints.length; i++) {
        let constraint = allConstraints[i],
          bodyA = constraint.bodyA,
          bodyB = constraint.bodyB,
          pointAWorld = constraint.pointA,
          pointBWorld = constraint.pointB;

        if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
        if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

        if (!pointAWorld || !pointBWorld) continue;

        if (
          Bounds.contains(render.bounds, pointAWorld) ||
          Bounds.contains(render.bounds, pointBWorld)
        )
          constraints.push(constraint);
      }

      // transform the view
      Render.startViewTransform(render);

      // update mouse
      if (render.mouse) {
        Mouse.setScale(render.mouse, {
          x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
          y: (render.bounds.max.y - render.bounds.min.y) / render.options.height,
        });

        Mouse.setOffset(render.mouse, render.bounds.min);
      }
    } else {
      constraints = allConstraints;
      bodies = allBodies;

      if (render.options.pixelRatio !== 1) {
        render.context.setTransform(
          render.options.pixelRatio,
          0,
          0,
          render.options.pixelRatio,
          0,
          0,
        );
      }
    }
    Render.constraints(constraints, context);

    if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
      // fully featured rendering of bodies
      Render.bodies(render, bodies, context);
    } else {
      if (options.showConvexHulls) Render.bodyConvexHulls(render, bodies, context);

      // optimised method for wireframes only
      Render.bodyWireframes(render, bodies, context);
    }

    if (options.showBounds) Render.bodyBounds(render, bodies, context);

    if (options.showAxes || options.showAngleIndicator) Render.bodyAxes(render, bodies, context);

    if (options.showPositions) Render.bodyPositions(render, bodies, context);

    if (options.showVelocity) Render.bodyVelocity(render, bodies, context);

    if (options.showIds) Render.bodyIds(render, bodies, context);

    if (options.showSeparations) Render.separations(render, engine.pairs.list, context);

    if (options.showCollisions) Render.collisions(render, engine.pairs.list, context);

    if (options.showVertexNumbers) Render.vertexNumbers(render, bodies, context);

    if (options.showMousePosition) Render.mousePosition(render, render.mouse, context);

    if (options.hasBounds) {
      // revert view transforms
      Render.endViewTransform(render);
    }

    Events.trigger(render, 'afterRender', event);

    // log the time elapsed computing this update
    timing.lastElapsed = Common.now() - startTime;
  };
}
