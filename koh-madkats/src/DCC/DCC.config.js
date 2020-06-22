import gql from 'graphql-tag'

export const GET_DCC = gql`
  subscription subscriptionDCC ($date: date!){
    dcc(where: {date: {_eq: $date}}) {
      date
      dccType
      id
      dcc_per_members(order_by: {member: {ign: asc}}) {
        member {
          ign
          id
        }
      }
    }
}`

export const QUERY_DCC_BY_DATE = gql`
  query getDCC ($date: date!) {
    dcc(where: {date: {_eq: $date}}) {
      id
      dccType
      dcc_per_members {
        member {
          ign
          id
        }
        id
      }
    }
  }`

export const GET_MEMBERS = gql`
  query getMembers {
      members(order_by: {ign: asc}, where: {_not: {archived: {_eq: true}}}) {
        id
        ign
      }
  }`

export const INSERT_DCC = gql`
  mutation insertDCC ($date: date!, $dccType: String!) {
    insert_dcc(objects: {date: $date, dccType: $dccType}) {
        returning {
            id
        }
    }
  }`

export const INSERT_DCC_BY_MEMBER = gql`
  mutation insertDCCByMember ($memberid: uuid!, $dccid: uuid!) {
    insert_dcc_per_member(objects: {memberid: $memberid, dccid: $dccid}) {
        affected_rows
    }
  }`


export const DELETE_DCC_BY_DCCID = gql`
  mutation deleteDCCByMember($dccid: uuid!) {
    delete_dcc_per_member(where: {dccid: {_eq: $dccid}}) {
        affected_rows
    }
  }
`
export const DELETE_DCC_BY_MEMBER = gql`
  mutation deleteDCCByMember($memberid: uuid!, $dccid: uuid!) {
    delete_dcc_per_member(where: {dccid: {_eq: $dccid}, memberid: {_eq: $memberid}}) {
        affected_rows
    }
  }
`


export const DELETE_DCC = gql`
  mutation deleteDCC ($id: uuid!){
    delete_dcc(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`