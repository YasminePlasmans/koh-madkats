import gql from 'graphql-tag'


export const GET_PintMisses = gql`
subscription MySubscription3($date: date!) {
  members(where: {pint_per_members: {bought: {_eq: false}, pint: {pintType: {_eq: "pint"}, date: {_gt:$date}}}}) {
    ign
    pint_per_members_aggregate(where: {bought: {_eq: false}, pint: {pintType: {_eq: "pint"}, date: {_gt: $date}}}) {
      aggregate {
        count
      }
    }
  }
}

`

export const GET_DCCMisses = gql`
subscription MySubscription4($date: date!) {
  members(where: {dcc_per_members: {dccid: {_is_null: false}, dcc: {date: {_gt: $date}}}}) {
    dcc_per_members_aggregate(where: {dccid: {_is_null: false}, dcc: {date: {_gt: $date}}}) {
        aggregate {
            count
        }
        nodes {
            dcc {
                dccType
            }
        }
    }
    ign
  }
}

`
export const GET_ALL_MISSES = gql`
subscription getAllMisses($date: date!) {
    members(where: {_or: [{dcc_per_members: {dccid: {_is_null: false}}}, {pint_per_members: {bought: {_eq: false}, pint: {pintType: {_eq: "pint"}, date: {_gt: $date}}}}]}) {
        ign
        dcc_per_members_aggregate(where: {dccid: {_is_null: false}, dcc: {date: {_gt: $date}}}) {
            aggregate {
                count
            }
            nodes {
                dcc {
                dccType
                }
            }
        }
        pint_per_members_aggregate(where: {bought: {_eq: false}, pint: {pintType: {_eq: "pint"}, date: {_gt: $date}}}) {
            aggregate {
                count
            }
        }
    }
}`

