import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UniswapV3Channel from '../../../showrunners-sdk/uniswapv3Channel';
import middlewares from '../../middlewares';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default(app: Router) => {
    app.use('/showrunners/uniswapv3', route);


    route.post(
        '/get_positions',
        celebrate({
            body: Joi.object({
                simulate: [Joi.bool(), Joi.object()]
            }),
        }),
        middlewares.onlyLocalhost,
        async (req: Request, res: Response, next: NextFunction) => {
            const Logger = Container.get('logger');
            Logger.debug('Calling /showrunners/uniswapv3/send_message ticker endpoint with body: %o', req.body );
            try {
                const uniswapv3 = Container.get(UniswapV3Channel);
                const response = await uniswapv3.getPositions(null, req.body.simulate);

                return res.status(201).json(response);
            } catch (e) {
                Logger.error('🔥 error: %o', e);
                return next(e)
            }
        }
    )
}