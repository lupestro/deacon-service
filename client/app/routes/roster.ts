import Route from '@ember/routing/route';

type RosterRouteParams = {
    picking: string;
};

export default class RosterRoute extends Route {    
    model(params: RosterRouteParams) {
        return { dutytype: params.picking };
    }
}