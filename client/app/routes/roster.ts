import Route from '@ember/routing/route';

export default class RosterRoute extends Route {
    
    model(params: RosterRouteParams) {
        return { dutytype: params.picking };
    }
}

type RosterRouteParams = {
    picking: string;
};
