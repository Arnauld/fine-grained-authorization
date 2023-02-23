module.exports = {
    /*

model
  schema 1.1
type user
type document
  relations
    define owner: [device]
    define can_read: can_read from owner
type device
  relations
    define group: [group]
    define can_read: group or can_read from group
type group
  relations
    define member: [user,user:*,group#member]
    define can_read: member or member from parent
    define parent: [group]

    */
    sampleAsJson: {
        "type_definitions": [
            {
                "type": "user",
                "relations": {}
            },
            {
                "type": "document",
                "relations": {
                    "owner": {
                        "this": {}
                    },
                    "can_read": {
                        "tupleToUserset": {
                            "tupleset": {
                                "object": "",
                                "relation": "owner"
                            },
                            "computedUserset": {
                                "object": "",
                                "relation": "can_read"
                            }
                        }
                    }
                },
                "metadata": {
                    "relations": {
                        "owner": {
                            "directly_related_user_types": [
                                {
                                    "type": "device"
                                }
                            ]
                        },
                        "can_read": {
                            "directly_related_user_types": []
                        }
                    }
                }
            },
            {
                "type": "device",
                "relations": {
                    "group": {
                        "this": {}
                    },
                    "can_read": {
                        "union": {
                            "child": [
                                {
                                    "computedUserset": {
                                        "object": "",
                                        "relation": "group"
                                    }
                                },
                                {
                                    "tupleToUserset": {
                                        "tupleset": {
                                            "object": "",
                                            "relation": "group"
                                        },
                                        "computedUserset": {
                                            "object": "",
                                            "relation": "can_read"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                "metadata": {
                    "relations": {
                        "group": {
                            "directly_related_user_types": [
                                {
                                    "type": "group"
                                }
                            ]
                        },
                        "can_read": {
                            "directly_related_user_types": []
                        }
                    }
                }
            },
            {
                "type": "group",
                "relations": {
                    "member": {
                        "this": {}
                    },
                    "can_read": {
                        "union": {
                            "child": [
                                {
                                    "computedUserset": {
                                        "object": "",
                                        "relation": "member"
                                    }
                                },
                                {
                                    "tupleToUserset": {
                                        "tupleset": {
                                            "object": "",
                                            "relation": "parent"
                                        },
                                        "computedUserset": {
                                            "object": "",
                                            "relation": "member"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "parent": {
                        "this": {}
                    }
                },
                "metadata": {
                    "relations": {
                        "member": {
                            "directly_related_user_types": [
                                {
                                    "type": "user"
                                },
                                {
                                    "type": "user",
                                    "wildcard": {}
                                },
                                {
                                    "type": "group",
                                    "relation": "member"
                                }
                            ]
                        },
                        "can_read": {
                            "directly_related_user_types": []
                        },
                        "parent": {
                            "directly_related_user_types": [
                                {
                                    "type": "group"
                                }
                            ]
                        }
                    }
                }
            }
        ],
        "schema_version": "1.1"
    }
}