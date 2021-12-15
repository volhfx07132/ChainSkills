var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "article 1";
  var articleDescription1 = "Description for article 1";
  var articlePrice1 = 10;
  var articleName2 = "article 2";
  var articleDescription2 = "Description for article 2";
  var articlePrice2 = 20;

  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

  it("should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.getNumberOfArticle();
    }).then(function(data) {
      assert.equal(data, 0, "Number of article must be 0");
      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 0, "Articles for sale of articles must be 0");
    });
  });

  it("Should let us sell first article", function(){
    return ChainList.deployed().then(function(instance) {
       chainListInstance = instance;
       return chainListInstance.sellArticle(articleName1, articleDescription1, articlePrice1, {from: seller});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id, 1, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price, articlePrice1, "event article price must be " + articlePrice1);
      return chainListInstance.getNumberOfArticle();
    }).then(function(data){
      assert.equal(data, 1, "Number of article must be 1");
      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 1, "Articles for sale of articles must be 1");
      return chainListInstance.articles(data[0]);
    }).then(function(data) {
      assert.equal(data[0], data[0], "id of seller must be " + 1);
      assert.equal(data[1], seller, "seller must be " + 1);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName1, "article name must be " + articleName1);
      assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1);
      assert.equal(data[5].toNumber(), articlePrice1, "article price must be " + articlePrice1);
    });
  });

  it("Should let us sell second article", function(){
    return ChainList.deployed().then(function(instance) {
       chainListInstance = instance;
       return chainListInstance.sellArticle(articleName2, articleDescription2, articlePrice2, {from: seller});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogSellArticle", "event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id, 2, "event seller must be " + 2);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, articleName2, "event article name must be " + articleName2);
      assert.equal(receipt.logs[0].args._price, articlePrice2, "event article price must be " + articlePrice2);
      return chainListInstance.getNumberOfArticle();
    }).then(function(data){
      assert.equal(data, 2, "Number of article must be 2");
      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 2, "Articles for sale of articles must be 2");
      return chainListInstance.articles(data[1]);
    }).then(function(data) {
      assert.equal(data[0], 2, "id of seller must be " + 1);
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], articleName2, "article name must be " + articleName2);
      assert.equal(data[4], articleDescription2, "article description must be " + articleDescription2);
      assert.equal(data[5].toNumber(), articlePrice2, "article price must be " + articlePrice2);
    })
  })


  it("should buy an article", function(){
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      // record balances of seller and buyer before the bu
      return chainListInstance.buyArticle(1, {
        from: buyer,
        value: articlePrice1
      });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogBuyArticle", "event should be LogBuyArticle");
      assert.equal(receipt.logs[0].args._id, 1, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
      assert.equal(receipt.logs[0].args._name, articleName1, "event article name must be " + articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), articlePrice1, "event article price must be " + articlePrice1);
      // check the effect of buy on balances of buyer and seller, accounting for gas
      return chainListInstance.articles(1);
    }).then(function(data) {
      assert.equal(data[0], 1, "id of seller must be " + 1);
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], buyer, "buyer must be empty");
      assert.equal(data[3], articleName1, "article name must be " + articleName1);
      assert.equal(data[4], articleDescription1, "article description must be " + articleDescription1);
      assert.equal(data[5].toNumber(), articlePrice1, "article price must be " + articlePrice1);
      return chainListInstance.getNumberOfArticle();
    }).then(function(data) {
      assert.equal(data, 2, "Number of article must be 2");
      return chainListInstance.getArticlesForSale();
    }).then(function(data) {
      assert.equal(data.length, 1, "Articles for sale of articles must be 2");
    })
  });

});
