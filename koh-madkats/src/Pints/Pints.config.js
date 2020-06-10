import gql from 'graphql-tag'

export const GET_PINTS = gql`
subscription GetPints {
    pints {
      date
      id
      membersAmount
      membersFinished
      pintType
      pint_per_members {
        member {
          ign
          id
        }
      }
    }
  }
  `

  export const GET_MEMBERS = gql`
  query getMembers {
      members(order_by: {ign: asc}, where: {_not: {archived: {_eq: true}}}) {
        id
        ign
        might
        rank
      }
  }`

  export const pintTypes = [
    {
        label: "Pint",
        value: "pint"
    },
    {
        label: "Raid pint",
        value: "raidPint"
    },
    {
        label: "Pack",
        value: "pack"
    }
]