// contract to be tested
var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract("ChainList", function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "article 1";
  var articleDescription1 = "Description for article 1";
  var articlePrice1 = 10;

  // no article for sale yet
  it("should throw an exception if you try to buy an article when there is no article for sale yet", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.buyArticle(1,{
        from: buyer,
        value: web3.toWei(articlePrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return chainListInstance.getNumberOfArticle();
    }).then(function(data) {
      assert.equal(data, 0, "numbmer of article must be 0");
    });
  });
  
  //Buy an article that dose not exitst
  it("Should throw an exception buy an article that dose not exitst", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName1, articleDescription1, articlePrice1, {from: seller});
    }).then(function(receipt){
        return chainListInstance.buyArticle(2, {from: buyer, value: articlePrice1});
    }).then(assert.fail)
      .catch(function(error){
        assert(true);
      }).then(function(){
        return chainListInstance.articles(1);
      }).then(function(data){
        assert.equal(data[0], 1, "id of seller must be " + 1);
        assert.equal(data[1], seller, "seller must be " + seller);
        assert.equal(data[2], 0x0, "buyer must be empty");
        assert.equal(data[3], articleName1, "article name must be " + articleName1);
        assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1);
        assert.equal(data[5].toNumber(), articlePrice1, "article price must be " + articlePrice1);
      })
  })
});
