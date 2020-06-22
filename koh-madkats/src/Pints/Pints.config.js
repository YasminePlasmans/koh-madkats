import gql from 'graphql-tag'

export const GET_PINTS = gql`
subscription GetPints($date: date!) {
    members(order_by: {archived: asc, ign: asc}) {
        pint_per_members(where: {pint: {date: {_eq: $date}}}) {
        bought
        id
        pint {
          pintType
        }
        pintid
      }
      ign
      id
      archived
    }
  }
  `

  export const QUERY_PINTS = gql`
  subscription subscriptionPints ($date: date!) {
    pints(where: {date: {_eq: $date}}) {
        id
        pintType
      }
  }`

  export const QUERY_PINTS_BY_DATE = gql`
  query getPints ($date: date!) {
    pints(where: {date: {_eq: $date}}) {
        id
        pintType
      }
  }`

  export const GET_MEMBERS = gql`
  query getMembers {
      members(order_by: {ign: asc}, where: {_not: {archived: {_eq: true}}}) {
        id
        ign
        might
        rank
      }
  }`

  export const INSERT_PINTS = gql`
  mutation insertPints ($date: date!, $pintType: String!, $membersFinished: Int!, $membersAmount: Int!) {
    insert_pints(objects: {date: $date, pintType: $pintType, membersFinished: $membersFinished, membersAmount: $membersAmount}) {
        returning {
            id
        }
    }
  }`

  export const INSERT_PINTS_BY_MEMBER = gql`
  mutation insertPintsByMember ($bought: Boolean!, $memberid: uuid!, $pintid: uuid!) {
    insert_pint_per_member(objects: {bought: $bought, memberid: $memberid, pintid: $pintid}) {
        affected_rows
    }
  }`

  export const UPDATE_PINTS_BY_MEMBER = gql`
  mutation updatePintsByMember($bought: Boolean = false, $id: uuid = "") {
    update_pint_per_member(where: {id: {_eq: $id}}, _set: {bought: $bought}){
        affected_rows
    }
  }
  `

  export const pintTypes = [
    {
        label: "Pint",
        value: "pint"
    },
    {
        label: "Raid pint",
        value: "raidPint"
    }
]