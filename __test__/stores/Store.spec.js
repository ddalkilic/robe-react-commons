import React from "react";// eslint-disable-line
import Store from "stores/Store";// eslint-disable-line
import StoreComponent from "components/StoreComponent";// eslint-disable-line
import Assertions from "utils/Assertions";// eslint-disable-line
import { RemoteEndPoint } from "index";// eslint-disable-line
import chai from "chai";// eslint-disable-line import/no-extraneous-dependencies
import { asyncIt, renderIntoDocument, findRenderedDOMComponentWithTag } from "../TestUtils";

/** @test {Store} */
describe("Store.js", () => {
    const url = "http://localhost:3000/posts";
    /** @test {Store#constructor} */
    it("constructors", () => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            })
        });
        chai.assert.operator(store.getObjectId(), ">=", 0);
        chai.assert.isTrue(Assertions.isFunction(store.getProps().importer), true);
        chai.assert.equal(store.getProps().idField, "oid");
        chai.assert.equal(store.getProps().autoLoad, false);

        store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            autoLoad: true,
            idField: "id"
        });
        chai.assert.operator(store.getObjectId(), ">=", 0);
        chai.assert.isTrue(Assertions.isFunction(store.getProps().importer), true);
        chai.assert.equal("id", store.getProps().idField);
        chai.assert.equal(store.getProps().autoLoad, true);
        chai.assert.deepEqual(store.getProps().importer({}), {});
    });
    /** @test {Store#getProps} */
    it("getProps", () => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            autoLoad: true,
            idField: "id",
            importer: (response: any): any => {
                return response;
            }
        });
        chai.assert.operator(store.getObjectId(), ">=", 0);
        chai.assert.isTrue(Assertions.isFunction(store.getProps().importer), true);
        chai.assert.equal(store.getProps().idField, "id");
        chai.assert.equal(store.getProps().autoLoad, true);
    });
    /** @test {Store#getObjectId} */
    it("getObjectId", () => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            })
        });
        let store2 = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            })
        });
        chai.assert.operator(store.getObjectId(), ">=", 0);
        chai.assert.operator(store2.getObjectId(), ">", store.getObjectId());
    });
    /** @test {Store#getName} */
    it("getName", () => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            })
        });
        chai.assert.equal(store.getName(), "Store");
    });

    /** @test {Store#getResult} */
    asyncIt("getResult", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            autoLoad: true,
            onSuccess: (result: Map) => {
                chai.assert.isArray(result.data);
                chai.assert.isNumber(result.totalCount);
                done();
            },
            // onError: (error: Map) => {
            onError: () => {
                done();
            }
        });
        let expectedDefaultResult = {
            data: [],
            totalCount: 0
        };
        // default check code.
        chai.assert.deepEqual(store.getResult(), expectedDefaultResult);
    });

    /** @test {Store#register} */
    asyncIt("register", (done: Function) => {
        // Render a checkbox with label in the document
        class TestComponent extends StoreComponent {
            constructor(props: Object) {
                super(props);
                this.state = {
                    size: props.stores[0].getResult().data.length
                };
            }
            render(): string {
                return (
                    <div>
                        {this.state.size}
                    </div>
                );
            }
            triggerChange(store: Store) {
                this.setState({
                    size: store.getResult().data.length
                });
            }
        }

        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            autoLoad: true,
            // onSuccess: (result: Map) => {
            onSuccess: () => {
                let test2 = renderIntoDocument(<TestComponent stores={[store]} />);
                done();
            },
            // onError: (error: Map) => {
            onError: () => {
                done();
            }
        });
        let test = renderIntoDocument(<TestComponent stores={[store]} />);
    });
    /** @test {Store#unRegister} */
    it("unRegister", () => {

    });
    /** @test {Store#triggerChanges} */
    it("triggerChanges", () => {

    });
    /** @test {Store#triggerChange} */
    it("triggerChange", () => {

    });
    /** @test {Store#_onSuccess} */
    it("_onSuccess", () => {

    });
    /** @test {Store#_onError} */
    it("_onError", () => {

    });
    /** @test {Store#__successCallback} */
    it("__successCallback", () => {

    });
    /** @test {Store#__errorCallBack} */
    it(" __errorCallBack", () => {

    });
    /** @test {Store#read} */
    asyncIt("read", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "page not found"
            })
        });

        store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            idField: "id"
        });

        store.read(
            (result: Map) => {
                try {
                    chai.assert.isArray(result.data);
                    chai.assert.isNumber(result.totalCount);
                    done();
                } catch (e) {
                    done(e);
                }
            },
            () => {
                try {
                    chai.assert(false, "Request should be success ! ");
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });
    /** @test {Store#create} */
    asyncIt("create", (done: Function) => {
        let item = { id: new Date().getTime(), title: "Post" };
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            idField: "id",
            autoLoad: true,
            onSuccess: () => {
                let count = store.getResult().data.length;
                store.create(
                    item,
                    () => {
                        try {
                            chai.assert.equal(store.getResult().data.length, count + 1);
                            done();
                        } catch (e) {
                            done(e);
                        }
                    },
                    // (error: Map) => {
                    () => {
                        done();
                    }
                );
            },
            //  onError: (error: Map) => {
            onError: () => {
                done();
            }
        });
    });
    /** @test {Store#update} */
    asyncIt("update", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            idField: "id",
            autoLoad: true,
            onSuccess: () => {
                let count = store.getResult().data.length;
                if (count > 1) {
                    let updatedItem = store.getResult().data[1];
                    updatedItem.title = "updated title";
                    store.update(
                        updatedItem,
                        () => {
                            try {
                                chai.assert.equal(store.getResult().data.length, count);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        },
                        // (error: Map) => {
                        () => {
                            done();
                        }
                    );
                } else {
                    done();
                }
            },
            // onError: (error: Map) => {
            onError: () => {
                done();
            }
        });
    });
    /** @test {Store#delete} */
    asyncIt("delete", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: url
            }),
            idField: "id",
            autoLoad: true,
            onSuccess: () => {
                let count = store.getResult().data.length;
                if (count > 1) {
                    let willDeleteItem = store.getResult().data[1];
                    store.delete(
                        willDeleteItem,
                        () => {
                            try {
                                chai.assert.equal(store.getResult().data.length, count - 1);
                                done();
                            } catch (e) {
                                done(e);
                            }
                        },
                        // (error: Map) => {
                        () => {
                            done();
                        }
                    );
                } else {
                    done();
                }
            },
            //  onError: (error: Map) => {
            onError: () => {
                done();
            }
        });
    });

    asyncIt("callbacks - onConstructor", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "page not found"
            }),
            onError: (error: Object, operator: string) => {
                try {
                    chai.assert.equal(operator, "read");
                    chai.assert.isNotNull(error);
                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
        store.read(
            () => { done(); },
            undefined);
    });

    asyncIt("callbacks - onOperation", (done: Function) => {
        let store = new Store({
            endPoint: new RemoteEndPoint({
                url: "page not found"
            }),
            autoLoad: false,
            onError: (error: Object, operator: string) => {
                try {
                    chai.assert.equal(operator, "");
                    chai.assert.isNull(error);
                    done();
                } catch (e) {
                    done(e);
                }
            }
        });
        store.read(
            () => { done(); },
            (error: Object) => {
                try {
                    chai.assert.isNotNull(error);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });
});
